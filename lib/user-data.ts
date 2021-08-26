const goVersion = '1.17';
const nvmVersion = '0.38.0';
const nodeVersion = '14.17.5';

export function userData(): string {
  return [
    '#!/bin/bash',
    // Pipe logs.
    'exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1',
    // Install updates.
    'apt update',
    'apt upgrade -y',
    // Install GCC.
    'apt install gcc -y',
    // Install Go.
    `wget https://golang.org/dl/go${goVersion}.linux-amd64.tar.gz`,
    'rm -rf /usr/local/go',
    `tar -C /usr/local -xzf go${goVersion}.linux-amd64.tar.gz`,
    `rm -rf go${goVersion}.linux-amd64.tar.gz`,
    'echo "" >> /home/ubuntu/.profile',
    'echo "# Add Go bin directory to path." >> /home/ubuntu/.profile',
    'echo "export PATH=\$PATH:/usr/local/go/bin" >> /home/ubuntu/.profile',
    // Install NVM.
    `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v${nvmVersion}/install.sh | bash`,
    `nvm install v${nodeVersion}`,
    // Setup Git.
    'git config --global user.email taliesinwrmillhouse@gmail.com',
    'git config --global user.name "Taliesin Millhouse"',
    'git config core.fileMode false',
    'git config --global init.defaultBranch main',
    // Create code directory.
    'mkdir -p /home/ubuntu/code',
    'chown ubuntu:ubuntu /home/ubuntu/code'
  ].join('\n')
}
