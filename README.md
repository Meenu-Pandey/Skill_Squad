# SkillSquad Project Setup

This project includes a static frontend and a minimal PHP backend (MySQL) for handling form submissions.

What’s included
- Frontend: HTML/CSS/JS under the project root and css/, js/.
- Backend: PHP endpoints under backend/ using mysqli.
- Apply form: Multi-step form that submits to backend/submit_application.php and persists to MySQL.

Prerequisites
- Web server with PHP 7.4+ (Apache/Nginx) and MySQL 5.7+/8.0
- Ensure the project is served from a directory PHP can execute (not via file://).

Environment configuration
1) Create a DB and a non-root user in MySQL:
   CREATE DATABASE course_requests;
   CREATE USER 'skillsquad_user'@'localhost' IDENTIFIED BY 'your_strong_password';
   GRANT ALL PRIVILEGES ON course_requests.* TO 'skillsquad_user'@'localhost';
   FLUSH PRIVILEGES;

2) Set environment variables for PHP (recommended):
   Use your web server’s environment or a dotenv loader to set:
   - DB_HOST
   - DB_NAME
   - DB_USER
   - DB_PASS

   A .env.example is provided. If you use Apache, you can set env vars in the vhost or via SetEnv.

3) Optional: local fallback
   If env vars are not present, backend/db_config.php falls back to defaults. Change the defaults or set env vars before deploying.

Running locally
- Place this folder under your web server root (e.g., htdocs on XAMPP) or configure a virtual host.
- Visit http://localhost/Skill_Squad/index.html
- The Apply form (apply.html) posts to backend/submit_application.php. Ensure PHP can connect to MySQL.

Security notes
- Do not use root in production. Use a dedicated DB user.
- Consider adding CSRF protection and rate limiting for public endpoints.
- Avoid committing real secrets; use environment variables instead.

Troubleshooting
- If the application form returns an error:
  - Check PHP error logs for mysqli errors.
  - Verify the applications table exists (it is auto-created in backend/db_config.php on first load).
  - Confirm DB credentials via environment variables or defaults.


