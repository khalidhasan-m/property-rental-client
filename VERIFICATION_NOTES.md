# Client smoke-test notes

The local Next.js development server loaded the Nestora landing page successfully on 2026-08-23. The desktop hero, property search controls, featured-property empty state, navigation, extra content sections, and footer were visually present with no rendering error.

The All Properties route also loaded successfully with URL query parameters. The location filter displayed `Dhaka`, the sort control displayed `Price: low to high`, and the no-results empty state remained stable while the API server was not running.

The production client build completed successfully after these visual checks.
