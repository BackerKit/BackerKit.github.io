# BackerKit.github.io
Website for BackerKit's summit

In order to serve the github pages at https://bond.backerkit.com the following changes needed to be made:

### Organization level github pages structure

In order to have a more friendly url to serve as our proxy redirect, we needed to follow the organization level github pages structure
More information can be found [here](https://help.github.com/articles/user-organization-and-project-pages/)

  - To have the github pages sit at the organization level, the repository name needs to start with the exact match of the orgnaization level ("BackerKit"). Since we have another repo with the name "BackerKit" we chose "BackerKit.github.io" to signify this is the repository linked ot the org level gh pags
  - For organization level github pages, content from the master branch will be used to build and publish your GitHub Pages site. We copied over the code form the gh-pages branch to the master branch
  
### HTTPS serving through nginx

- In order to serve the github pages site using the bond subdomain on BackerKit's site, the rails nginx confguration was updated with the follwing:

```
server {
    listen <%= ENV.fetch('PORT', 7000) %>;

    server_name bond.backerkit.com bond.neighborhoodcuts.com bond.backerkit.dev;
    location / {
        port_in_redirect off;
        proxy_connect_timeout 10s;
        proxy_send_timeout 10s;
        proxy_read_timeout 10s;
        proxy_redirect off;
        proxy_pass https://backerkit.github.io;
    }
}
```

- This handles a reverse proxy and no changes were needed in our DNS settings.

- This solution handles both HTTP and HTTPS but does not force SSL on HTTP connections.
