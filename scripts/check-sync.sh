#!/bin/bash
# Checks that key rules in standalone-agents and plugins match scaffold templates.
# Run: bash scripts/check-sync.sh

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

ERRORS=0

check_pattern() {
  local pattern="$1"
  local file="$2"
  local label="$3"
  if ! grep -q "$pattern" "$file" 2>/dev/null; then
    echo -e "${RED}DRIFT:${NC} $label missing from $file"
    ERRORS=$((ERRORS + 1))
  fi
}

echo "Checking standalone agents and plugins for drift..."
echo ""

# Trust: blocking rules must appear in all three places
for file in standalone-agents/trust/.claude/agents/trust.md plugins/trust/skills/security/SKILL.md; do
  check_pattern "Credentials in code" "$file" "Trust blocking rule 1"
  check_pattern "SQL injection" "$file" "Trust blocking rule 2"
  check_pattern "XSS" "$file" "Trust blocking rule 3"
  check_pattern "Auth bypass" "$file" "Trust blocking rule 4"
  check_pattern "PII exposure" "$file" "Trust blocking rule 5"
done

# Design: hard rules must appear in design agent and plugin
for file in standalone-agents/design/.claude/agents/design.md plugins/design/skills/design-system/SKILL.md; do
  check_pattern "shadcnblocks" "$file" "Design rule: shadcnblocks first"
  check_pattern "shadcn" "$file" "Design rule: shadcn second"
  check_pattern "custom CSS" "$file" "Design rule: no custom CSS"
done

# Testing: blocking behavior must be documented
for file in standalone-agents/testing/.claude/agents/testing.md plugins/testing/skills/test-strategy/SKILL.md; do
  check_pattern "ok.*false" "$file" "Testing blocking behavior"
done

# Strategy: EIID framework must be referenced
for file in standalone-agents/strategy/.claude/agents/strategy.md plugins/strategy/skills/alignment/SKILL.md; do
  check_pattern "opportunity" "$file" "Strategy opportunity scanning"
done

echo ""
if [ $ERRORS -eq 0 ]; then
  echo -e "${GREEN}All sync checks passed.${NC}"
else
  echo -e "${RED}${ERRORS} drift issues found.${NC} Update standalone-agents/ and plugins/ to match scaffold templates."
  exit 1
fi
