
GitHub stars GitHub contributors MIT License
Closed issues Closed PR Open issues Open PR

nginxconfig

⚙️ NGINX configuration generator on steroids 💉
The only tool you'll ever need to configure your NGINX server.
do.co/nginxconfig »

Report a bug · Request a feature


✨ NGINX Config
NGINX is so much more than just a webserver. You already knew that, probably.

We love NGINX, because:

Low memory usage
High concurrency
Asynchronous event-driven architecture
Load balancing
Reverse proxying
FastCGI support with caching (PHP)
Amazing fast handling of static files
TLS/SSL with SNI
A lot of features with corresponding configuration directives. You can deep dive into the NGINX documentation right now OR you can use this tool to check how NGINX works, observe how your inputs are affecting the output, and generate the best config for your specific use-case (in parallel you can also still use the docs).

🚀 Usage
GOTO do.co/nginxconfig

Features: HTTPS, HTTP/2, IPv6, certbot, HSTS, security headers, SSL profiles, OCSP resolvers, caching, gzip, brotli, fallback routing, reverse proxy, www/non-www redirect, CDN, PHP (TCP/socket, WordPress, Drupal, Magento, Joomla), Node.js support, Python (Django) server, etc.

👨‍💻 Author
Rewrite & Maintenance
Matt (IPv4) Cowley <me@mattcowley.co.uk> (https://mattcowley.co.uk)

GitHub: @MattIPv4
Original version
Bálint Szekeres <balint@szekeres.me> (https://balint.szekeres.me)

GitHub: @0xB4LINT
LinkedIn: @0xB4LINT
▶️ Development
Clone the repository

git clone https://github.com/digitalocean/nginxconfig.io.git
Install NPM packages

npm ci
Run the development server (with file watchers)

npm run dev
Open the development site localhost:8080

Lint your code (eslint & stylelint)

npm test
Build for production (to the dist directory)

npm run build
🤝 Contributing
Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are greatly appreciated.

Fork the Project
Create your Feature Branch (git checkout -b feature/AmazingFeature)
Commit your Changes (git commit -m 'Add some AmazingFeature')
Push to the Branch (git push origin feature/AmazingFeature)
Open a Pull Request
⚒️ Built With
Vue.js - Template handling & app generation
Bulma - Base styling, customised by do-bulma
Prism - Bash & NGINX syntax highlighting
📚 Resources
Mozilla SSL Configuration Generator v5
Mozilla SSL Configuration Generator
OWASP TLS Cipher String Cheat Sheet
Nginx Optimization: understanding sendfile, tcp_nodelay and tcp_nopush
NGINX Tuning For Best Performance
Hardening Your HTTP Security Headers
h5bp/server-configs-nginx
Diffie-Hellman DSA-like parameters
hstspreload.org
Optimal value for nginx worker_connections
⭐️ Show your support
Give a ⭐️ if this project helped you!

📝 License
Copyright © 2020 DigitalOcean, Inc <contact@digitalocean.com> (https://www.digitalocean.com).
This project is licensed under the MIT license.
