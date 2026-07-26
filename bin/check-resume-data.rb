#!/usr/bin/env ruby
# frozen_string_literal: true

# check-resume-data.rb — guard against drift between the two resume data files.
#
#   ruby bin/check-resume-data.rb
#
# Why this exists: _data/experience.yml (nested roles, used by pages/resume/index.html)
# and _data/experience-federal.yml (flat entries, used by pages/resume/federal.html)
# duplicate the same career facts. In July 2026 the Crew Lead dates were corrected in
# experience.yml but not in experience-federal.yml, and the stale value kept resurfacing.
# Run this before publishing a resume change. Exits non-zero on any mismatch.
#
# The model this enforces: FEDERAL IS A SUPERSET OF CONCISE.
# The federal resume is intentionally longer and tailored per announcement, so extra
# roles and extra detail there are expected and fine. What must never diverge is the
# underlying facts — dates, titles, and grades for any role appearing in both files.
# A role in the concise resume but missing from the federal one IS an error: the
# federal record should be complete.

require "yaml"
require "set"

ROOT = File.expand_path("..", __dir__)
CONCISE = File.join(ROOT, "_data", "experience.yml")
FEDERAL = File.join(ROOT, "_data", "experience-federal.yml")

# Entries in experience-federal.yml that intentionally combine several roles into one
# block. Key = title, value = explanation. These are exempt from date comparison but
# must stay declared here so the exemption is deliberate rather than accidental.
COMPOSITE_ENTRIES = {
  # "Some Title" => "why this entry spans more than one role"
}.freeze

def norm(str)
  str.to_s.strip.downcase.gsub(/[[:space:]]+/, " ")
end

def concise_roles
  data = YAML.load_file(CONCISE)
  roles = []
  data["jobs"].each do |job|
    employer = job["name"]
    if job["roles"]
      job["roles"].each do |r|
        start_d, end_d = r["dates"].to_s.split(/\s*-\s*/, 2)
        roles << { employer: employer, title: r["title"], start: start_d, end: end_d }
      end
    else
      roles << { employer: employer, title: job["title"],
                 start: job["start-date"], end: job["end-date"] }
    end
  end
  roles
end

def federal_roles
  YAML.load_file(FEDERAL)["jobs"].map do |job|
    { employer: job["name"], title: job["title"],
      start: job["start-date"], end: job["end-date"] }
  end
end

# Employer names that differ cosmetically between the two files but are the same org.
EMPLOYER_ALIASES = {
  "microsoft corporation" => "microsoft"
}.freeze

def canon_employer(name)
  n = norm(name)
  EMPLOYER_ALIASES.fetch(n, n)
end

problems = []
warnings = []

a = concise_roles
b = federal_roles

index = lambda do |roles|
  roles.each_with_object({}) { |r, h| h[[canon_employer(r[:employer]), norm(r[:title])]] = r }
end

ia = index.call(a)
ib = index.call(b)

# 1. Date agreement on roles present in both files
(ia.keys & ib.keys).sort.each do |key|
  ra = ia[key]
  rb = ib[key]
  if COMPOSITE_ENTRIES.key?(rb[:title])
    warnings << "composite entry skipped: #{rb[:title]} (#{COMPOSITE_ENTRIES[rb[:title]]})"
    next
  end
  if norm(ra[:start]) != norm(rb[:start]) || norm(ra[:end]) != norm(rb[:end])
    problems << <<~MSG
      DATE MISMATCH — #{ra[:employer]} / #{ra[:title]}
        experience.yml          : #{ra[:start]} – #{ra[:end]}
        experience-federal.yml  : #{rb[:start]} – #{rb[:end]}
    MSG
  end
end

# 2. Federal must be a superset: anything on the concise resume must also be
#    on the federal one. The reverse is fine — federal is deliberately more verbose.
(ia.keys - ib.keys).sort.each do |emp, title|
  problems << <<~MSG
    MISSING FROM FEDERAL — #{emp} / #{title}
      Present in experience.yml but absent from experience-federal.yml.
      The federal record should be at least as complete as the concise one.
  MSG
end
(ib.keys - ia.keys).sort.each do |emp, title|
  warnings << "federal-only (expected — federal runs longer): #{emp} / #{title}"
end

# 3. Duplicate role keys within a single file would make matching unreliable.
[["experience.yml", a], ["experience-federal.yml", b]].each do |label, roles|
  seen = Hash.new(0)
  roles.each { |r| seen[[canon_employer(r[:employer]), norm(r[:title])]] += 1 }
  seen.select { |_, n| n > 1 }.each_key do |emp, title|
    problems << "DUPLICATE ROLE KEY in #{label} — '#{title}' appears more than once under #{emp}. " \
                "Give the roles distinct titles so their dates can be compared."
  end
end

puts "Checked #{a.size} roles in experience.yml against #{b.size} in experience-federal.yml\n\n"

unless warnings.empty?
  puts "Notes (#{warnings.size}):"
  warnings.each { |w| puts "  · #{w}" }
  puts
end

if problems.empty?
  puts "✓ No date contradictions."
  exit 0
else
  puts "✗ #{problems.size} problem(s):\n\n"
  problems.each { |p| puts p }
  puts "Fix the source files, then re-run. See facts/02-gaps-and-limitations.md in the"
  puts "job-search vault for the resolution history on any recurring conflict."
  exit 1
end
