export function userData(): string {
  return [
    '#!/bin/bash',
    'exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console) 2>&1',
    'apt update',
    'apt upgrade -y',
    'mkdir -p /home/ubuntu/code'
  ].join('\n')
}
