## Getting Started

## Links
- Client Repo: https://github.com/jinglechen2287/si679-final-client
- Client Deployment URL: https://si679-final-client.vercel.app/

### Instructions

1. Install dependencies. 
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory. There is no need to edit it if following the instruction.
   ```bash
    cp .env.example .env
   ```

3. Generate JWT keys.
   ```bash
   openssl genrsa -out jwt.key 2048
   openssl rsa -in jwt.key -pubout -out jwt.key.pub
   ```

4. Generate SSL certificates for HTTPS.
   ```bash
   openssl genrsa -out localhost-key.pem 2048
   openssl req -new -x509 -key localhost-key.pem -out localhost.pem -days 365
   ```

5. Setup MongoDB using thedefault server and port localhost:27017

6. Start local dev server.
   ```bash
   npm run dev
   ```

7. Run tests.
   ```bash
   npm test
   npm run coverage
   ```

8. Test in postman by importing postman/Hybrid-Authoring.postman_collection.json to postman

9. Configure the application to deploy to GCP through VM. Before doing this step, make sure to install and configure nodejs, npm, git, and Mongo on the VM.
   1. Clone and build the server
        ```bash
        git clone https://github.com/jinglechen2287/si679-final-server.git
        cd si679-final-server

        npm install
        npm run build
        ```
   2. Generate JWT keys
        ```bash
        openssl genrsa -out jwt.key 2048
        openssl rsa -in jwt.key -pubout -out jwt.key.pub
        ```
   3. Generate SSL Certificate
        ```bash
        openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
            -keyout selfsigned.key \
            -out selfsigned.crt
        ```
    4. Setup /etc/systemd/system/si679-final-server.service similar to the following.
        ```env
        [Unit]
        Description=Hybrid Authoring Server
        Documentation=https://github.com/jinglechen2287/si679-final-server.git
        Author=Jingle Chen
        [Service]
        # Start Service and Examples
        ExecStart=/usr/bin/node /home/chenjingle0525/si679-final-server/dist/server.js
        WorkingDirectory=/home/chenjingle0525/si679-final-server
        # Options Stop and Restart
        # ExecStop=
        # ExecReload=

        # Restart service after 10 seconds if node service crashes
        RestartSec=10
        Restart=always
        # Restart=on-failure

        # Output to syslog
        StandardOutput=syslog
        StandardError=syslog
        SyslogIdentifier=nodejs-si679-final-server

        # #### please, not root users
        # RHEL/Fedora uses 'nobody'
        # User=nouser
        # Debian/Ubuntu uses 'nogroup', RHEL/Fedora uses 'nobody'
        # Group=nogroup

        # ENV variables
        Environment=PATH=/usr/bin:/usr/local/bin
        Environment=SERVER_DIR=/home/chenjingle0525/si679-final-server
        Environment=MONGO_URI="mongodb://127.0.0.1:27017"
        Environment=MONGO_DBNAME="hybrid-authoring"
        Environment=SSL_KEY_PATH="/home/chenjingle0525/si679-final-server/selfsigned.key"
        Environment=SSL_CERT_PATH="/home/chenjingle0525/si679-final-server/selfsigned.crt"
        Environment=JWT_PUBLIC_KEY_PATH="/home/chenjingle0525/si679-final-server/jwt.key.pub"
        Environment=JWT_PRIVATE_KEY_PATH="/home/chenjingle0525/si679-final-server/jwt.key"

        [Install]
        WantedBy=multi-user.target
        ```
