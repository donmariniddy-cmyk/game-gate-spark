# Architecture rules
- Use the games catalog in Lovable Cloud as the source for public lists and admin game management so edits appear consistently.
- Keep access grants library-wide, normalize email addresses, and enforce all administrative writes with database role policies.
- Treat external iframe loading as provider-dependent; never describe an iframe load event as proof of playable content.