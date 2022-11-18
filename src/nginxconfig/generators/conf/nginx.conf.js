/* 
 Copyright 2022 DigitalOcean 
  
 This code is licensed under the MIT License. 
 You may obtain a copy of the License at 
 https://github.com/digitalocean/nginxconfig.io/blob/master/LICENSE or https://mit-license.org/ 
  
 Permission is hereby granted, free of charge, to any person obtaining a copy 
 of this software and associated documentation files (the "Software"), to deal 
 in the Software without restriction, including without limitation the rights 
 to use, copy, modify, merge, publish, distribute, sublicense, and / or sell 
 copies of the Software, and to permit persons to whom the Software is 
 furnished to do so, subject to the following conditions : 
  
 The above copyright notice and this permission notice shall be included in 
 all copies or substantial portions of the Software. 
  
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.IN NO EVENT SHALL THE 
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN 
 THE SOFTWARE. 
 */ 
  
 import { errorLogPathDisabled } from '../../util/logging'; 
 import sslProfiles from '../../util/ssl_profiles'; 
 import websiteConf from './website.conf'; 
  
 export default (domains, global) => { 
     const config = {}; 
  
     // Source 
     config['# Generated by nginxconfig.io'] = ''; 
     config['# See nginxconfig.txt for the configuration share link'] = ''; 
  
     // Basic nginx conf 
     config.user = global.nginx.user.computed; 
     if (global.nginx.pid.computed) 
         config.pid = global.nginx.pid.computed; 
     config.worker_processes = global.nginx.workerProcesses.computed; 
     config.worker_rlimit_nofile = 65535; 
  
     // Modules 
     config['# Load modules'] = ''; 
     config.include = `${global.nginx.nginxConfigDirectory.computed.replace(/\/+$/, '')}/modules-enabled/*.conf`; 
  
     // Events 
     config.events = { 
         multi_accept: 'on', 
         worker_connections: 65535, 
     }; 
  
     // HTTP (kv so we can use the same key multiple times) 
     config.http = []; 
  
     config.http.push(['charset', 'utf-8']); 
     config.http.push(['sendfile', 'on']); 
     config.http.push(['tcp_nopush', 'on']); 
     config.http.push(['tcp_nodelay', 'on']); 
     if (!global.security.serverTokens.computed) 
         config.http.push(['server_tokens', 'off']); 
     if (!global.logging.logNotFound.computed) 
         config.http.push(['log_not_found', 'off']); 
     config.http.push(['types_hash_max_size', global.nginx.typesHashMaxSize.computed]); 
     config.http.push(['types_hash_bucket_size', global.nginx.typesHashBucketSize.computed]); 
     config.http.push(['client_max_body_size', `${global.nginx.clientMaxBodySize.computed}M`]); 
  
     config.http.push(['# MIME', '']); 
     config.http.push(['include', 'mime.types']); 
     config.http.push(['default_type', 'application/octet-stream']); 
  
     // Append Cloudflare request headers to the default log format 
     if (global.logging.cloudflare.computed) { 
         config.http.push(['# Log Format', '']); 
  
         // Define default log format as an array 
         let logging = ['$remote_addr', '-', '$remote_user', '[$time_local]', 
         '"$request"', '$status', '$body_bytes_sent', 
         '"$http_referer"', '"$http_user_agent"']; 
  
         if (global.logging.cfRay.computed) 
             logging.push('$http_cf_ray'); 
  
         if (global.logging.cfConnectingIp.computed) 
             logging.push('$http_cf_connecting_ip'); 
  
         if (global.logging.xForwardedFor.computed) 
             logging.push('$http_x_forwarded_for'); 
  
         if (global.logging.xForwardedProto.computed) 
             logging.push('$http_x_forwarded_proto'); 
  
         if (global.logging.trueClientIp.computed) 
             logging.push('$http_true_client_ip'); 
  
         if (global.logging.cfIpCountry.computed) 
             logging.push('$http_cf_ipcountry'); 
  
         if (global.logging.cfVisitor.computed) 
             logging.push('$http_cf_visitor'); 
  
         if (global.logging.cdnLoop.computed) 
             logging.push('$http_cdn_loop'); 
  
         config.http.push(['log_format', `cloudflare '${logging.join(' ')}'`]); 
     } 
  
     config.http.push(['# Logging', '']); 
     config.http.push(['access_log', 'off']); 
     if (global.logging.errorLogEnabled.computed) { 
         config.http.push(['error_log', global.logging.errorLogPath.computed.trim() + 
             ` ${global.logging.errorLogLevel.computed}`]); 
     } else { 
         config.http.push(['error_log', errorLogPathDisabled]); 
     } 
  
     if (global.security.limitReq.computed) { 
         config.http.push(['# Limits', '']); 
         config.http.push(['limit_req_log_level', 'warn']); 
         config.http.push(['limit_req_zone', '$binary_remote_addr zone=login:10m rate=10r/m']); 
     } 
  
     // HTTPS 
     let hasHttps = false; 
     for (const domain of domains) { 
         if (domain && domain.https && domain.https.https && domain.https.https.computed) { 
             hasHttps = true; 
             break; 
         } 
     } 
     if (hasHttps) { 
         config.http.push(['# SSL', '']); 
         config.http.push(['ssl_session_timeout', '1d']); 
         config.http.push(['ssl_session_cache', 'shared:SSL:10m']); 
         config.http.push(['ssl_session_tickets', 'off']); 
  
         const sslProfile = sslProfiles[global.https.sslProfile.computed]; 
         if (sslProfile) { 
             if (sslProfile.dh_param_size) { 
                 config.http.push(['# Diffie-Hellman parameter for DHE ciphersuites', '']); 
                 config.http.push(['ssl_dhparam', `${global.nginx.nginxConfigDirectory.computed.replace(/\/+$/, '')}/dhparam.pem`]); 
             } 
  
             config.http.push([`# ${sslProfile.name} configuration`, '']); 
             config.http.push(['ssl_protocols', sslProfile.protocols.join(' ')]); 
             if (sslProfile.ciphers.length) 
                 config.http.push(['ssl_ciphers', sslProfile.ciphers.join(':')]); 
             if (sslProfile.server_preferred_order) 
                 config.http.push(['ssl_prefer_server_ciphers', 'on']); 
         } 
  
         config.http.push(['# OCSP Stapling', '']); 
         config.http.push(['ssl_stapling', 'on']); 
         config.http.push(['ssl_stapling_verify', 'on']); 
  
         const ips = []; 
         if (global.https.ocspCloudflare.computed) { 
             if (['ipv4', 'both'].includes(global.https.ocspCloudflareType.computed)) 
                 ips.push('1.1.1.1', '1.0.0.1'); 
             if (['ipv6', 'both'].includes(global.https.ocspCloudflareType.computed)) 
                 ips.push('[2606:4700:4700::1111]', '[2606:4700:4700::1001]'); 
         } 
         if (global.https.ocspGoogle.computed) { 
             if (['ipv4', 'both'].includes(global.https.ocspGoogleType.computed)) 
                 ips.push('8.8.8.8', '8.8.4.4'); 
             if (['ipv6', 'both'].includes(global.https.ocspGoogleType.computed)) 
                 ips.push('[2001:4860:4860::8888]', '[2001:4860:4860::8844]'); 
         } 
         if (global.https.ocspOpenDns.computed) { 
             if (['ipv4', 'both'].includes(global.https.ocspOpenDnsType.computed)) 
                 ips.push('208.67.222.222', '208.67.220.220'); 
             if (['ipv6', 'both'].includes(global.https.ocspOpenDnsType.computed)) 
                 ips.push('[2620:119:35::35]', '[2620:119:53::53]'); 
         } 
         if (global.https.ocspQuad9.computed) { 
             if (['ipv4', 'both'].includes(global.https.ocspQuad9Type.computed)) 
                 ips.push('9.9.9.9', '149.112.112.112'); 
             if (['ipv6', 'both'].includes(global.https.ocspQuad9Type.computed)) 
                 ips.push('[2620:fe::fe]', '[2620:fe::9]'); 
         } 
         if (global.https.ocspVerisign.computed) { 
             if (['ipv4', 'both'].includes(global.https.ocspVerisignType.computed)) 
                 ips.push('64.6.64.6', '64.6.65.6'); 
             if (['ipv6', 'both'].includes(global.https.ocspVerisignType.computed)) 
                 ips.push('[2620:74:1b::1:1]', '[2620:74:1c::2:2]'); 
         } 
  
         if (ips.length) { 
             config.http.push(['resolver', `${ips.join(' ')} valid=60s`]); 
             config.http.push(['resolver_timeout', '2s']); 
         } 
     } 
  
     // Connection header for WebSocket reverse proxy 
     if (domains.some(d => d.reverseProxy.reverseProxy.computed)) { 
         config.http.push(['# Connection header for WebSocket reverse proxy', '']); 
         config.http.push(['map $http_upgrade $connection_upgrade', { 
             'default': 'upgrade', 
             '""': 'close', 
         }]); 
         // See https://www.nginx.com/resources/wiki/start/topics/examples/forwarded/ 
         config.http.push(['map $remote_addr $proxy_forwarded_elem', { 
             '# IPv4 addresses can be sent as-is': '', 
             '~^[0-9.]+$': '"for=$remote_addr"', 
             '# IPv6 addresses need to be bracketed and quoted': '', 
             '~^[0-9A-Fa-f:.]+$': '"for=\\"[$remote_addr]\\""', 
             '# Unix domain socket names cannot be represented in RFC 7239 syntax': '', 
             'default': '"for=unknown"', 
         }]); 
         config.http.push(['map $http_forwarded $proxy_add_forwarded', { 
             '# If the incoming Forwarded header is syntactically valid, append to it': '', 
             '': '"~^(,[ \\\\t]*)*([!#$%&\'*+.^_`|~0-9A-Za-z-]+=([!#$%&\'*+.^_`|~0-9A-Za-z-]+|\\"([\\\\t \\\\x21\\\\x23-\\\\x5B\\\\x5D-\\\\x7E\\\\x80-\\\\xFF]|\\\\\\\\[\\\\t \\\\x21-\\\\x7E\\\\x80-\\\\xFF])*\\"))?(;([!#$%&\'*+.^_`|~0-9A-Za-z-]+=([!#$%&\'*+.^_`|~0-9A-Za-z-]+|\\"([\\\\t \\\\x21\\\\x23-\\\\x5B\\\\x5D-\\\\x7E\\\\x80-\\\\xFF]|\\\\\\\\[\\\\t \\\\x21-\\\\x7E\\\\x80-\\\\xFF])*\\"))?)*([ \\\\t]*,([ \\\\t]*([!#$%&\'*+.^_`|~0-9A-Za-z-]+=([!#$%&\'*+.^_`|~0-9A-Za-z-]+|\\"([\\\\t \\\\x21\\\\x23-\\\\x5B\\\\x5D-\\\\x7E\\\\x80-\\\\xFF]|\\\\\\\\[\\\\t \\\\x21-\\\\x7E\\\\x80-\\\\xFF])*\\"))?(;([!#$%&\'*+.^_`|~0-9A-Za-z-]+=([!#$%&\'*+.^_`|~0-9A-Za-z-]+|\\"([\\\\t \\\\x21\\\\x23-\\\\x5B\\\\x5D-\\\\x7E\\\\x80-\\\\xFF]|\\\\\\\\[\\\\t \\\\x21-\\\\x7E\\\\x80-\\\\xFF])*\\"))?)*)?)*$" "$http_forwarded, $proxy_forwarded_elem"', 
             '# Otherwise, replace it': '', 
             'default': '"$proxy_forwarded_elem"', 
         }]); 
     } 
  
     // Configs! 
     config.http.push(['# Load configs', '']); 
     config.http.push(['include', [ 
         `${global.nginx.nginxConfigDirectory.computed.replace(/\/+$/, '')}/conf.d/*.conf`, 
         global.tools.modularizedStructure.computed ? `${global.nginx.nginxConfigDirectory.computed.replace(/\/+$/, '')}/sites-enabled/*` : '', 
     ].filter(x => x.length)]); 
  
     // Single file configs 
     if (!global.tools.modularizedStructure.computed) { 
         const ipPortPairs = new Set(); 
         for (const domain of domains) { 
             config.http.push([`# ${domain.server.domain.computed}`, '']); 
             config.http.push(...websiteConf(domain, domains, global, ipPortPairs)); 
         } 
     } 
  
     // Done! 
     return config; 
 };
