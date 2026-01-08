<h1 align="center">
  <br>
  <a href="https://www.overleaf.com"><img src="doc/logo.png" alt="Overleaf" width="300"></a>
</h1>

<h4 align="center">An open-source online real-time collaborative LaTeX editor.</h4>

<p align="center">
  <a href="https://github.com/overleaf/overleaf/wiki">Wiki</a> •
  <a href="https://www.overleaf.com/for/enterprises">Server Pro</a> •
  <a href="#contributing">Contributing</a> •
  <a href="https://mailchi.mp/overleaf.com/community-edition-and-server-pro">Mailing List</a> •
  <a href="#authors">Authors</a> •
  <a href="#license">License</a>
</p>

<img src="doc/screenshot.png" alt="A screenshot of a project being edited in Overleaf Community Edition">
<p align="center">
  Figure 1: A screenshot of a project being edited in Overleaf Community Edition.
</p>

## Community Edition

[Overleaf](https://www.overleaf.com) is an open-source online real-time collaborative LaTeX editor. We run a hosted version at [www.overleaf.com](https://www.overleaf.com), but you can also run your own local version, and contribute to the development of Overleaf.

> [!CAUTION]
> Overleaf Community Edition is intended for use in environments where **all** users are trusted. Community Edition is **not** appropriate for scenarios where isolation of users is required due to Sandbox Compiles not being available. When not using Sandboxed Compiles, users have full read and write access to the `sharelatex` container resources (filesystem, network, environment variables) when running LaTeX compiles.

For more information on Sandbox Compiles check out our [documentation](https://docs.overleaf.com/on-premises/configuration/overleaf-toolkit/server-pro-only-configuration/sandboxed-compiles).

## Enterprise

If you want help installing and maintaining Overleaf in your lab or workplace, we offer an officially supported version called [Overleaf Server Pro](https://www.overleaf.com/for/enterprises). It also includes more features for security (SSO with LDAP or SAML), administration and collaboration (e.g. tracked changes). [Find out more!](https://www.overleaf.com/for/enterprises)

## Keeping up to date

Sign up to the [mailing list](https://mailchi.mp/overleaf.com/community-edition-and-server-pro) to get updates on Overleaf releases and development.

## Installation

We have detailed installation instructions in the [Overleaf Toolkit](https://github.com/overleaf/toolkit/).

## Upgrading

If you are upgrading from a previous version of Overleaf, please see the [Release Notes section on the Wiki](https://github.com/overleaf/overleaf/wiki#release-notes) for all of the versions between your current version and the version you are upgrading to.

## User Management

### Creating Users

#### Creating Admin Users

To create an admin user, use the grunt wrapper command:

```bash
docker exec sharelatex grunt user:create-admin --email=admin@example.com
```

This will create an admin user and output a URL that the user can visit to set their password.

#### Creating Regular (Non-Admin) Users

To create a regular user, you need to use the Node.js script directly:

```bash
docker exec sharelatex bash -c "cd /overleaf/services/web && /sbin/setuser www-data node modules/server-ce-scripts/scripts/create-user.mjs --email=user@example.com"
```

To create a regular user with admin privileges, add the `--admin` flag:

```bash
docker exec sharelatex bash -c "cd /overleaf/services/web && /sbin/setuser www-data node modules/server-ce-scripts/scripts/create-user.mjs --admin --email=user@example.com
```

Both commands will output a URL that the user can visit to set their password and log in.

### Resetting User Passwords

To generate a password reset URL for an existing user:

```bash
docker exec sharelatex node /overleaf/services/web/modules/server-ce-scripts/scripts/reset-user-password.mjs --email=user@example.com
```

This will output a URL that the user can visit to set a new password. This is useful when:
- A user has forgotten their password
- You need to reset a user's password as an administrator
- Email functionality is not configured or working

The generated URL can be shared with the user directly.

### Listing Registered Users

To view all registered users in your Overleaf instance, connect to the MongoDB database:

```bash
# Connect to MongoDB shell
docker exec -it mongo mongosh sharelatex

# Once inside mongosh, list all users with their email and names
db.users.find({}, {email: 1, first_name: 1, last_name: 1, isAdmin: 1, signUpDate: 1}).pretty()

# Count total users
db.users.countDocuments({})

# List only admin users
db.users.find({isAdmin: true}, {email: 1, first_name: 1, last_name: 1}).pretty()

# Exit mongosh
exit
```

You can also query MongoDB directly from your host machine:

```bash
# List all users (one-liner)
docker exec mongo mongosh sharelatex --quiet --eval "db.users.find({email: {\$ne: ''}}, {email: 1, first_name: 1, last_name: 1, isAdmin: 1}).toArray()"

# Count users
docker exec mongo mongosh sharelatex --quiet --eval "db.users.countDocuments({})"
```

Note: The database name in the docker-compose.yml configuration is `sharelatex`.

## Overleaf Docker Image

This repo contains two dockerfiles, [`Dockerfile-base`](server-ce/Dockerfile-base), which builds the
`sharelatex/sharelatex-base` image, and [`Dockerfile`](server-ce/Dockerfile) which builds the
`sharelatex/sharelatex` (or "community") image.

The Base image generally contains the basic dependencies like `wget`, plus `texlive`.
We split this out because it's a pretty heavy set of
dependencies, and it's nice to not have to rebuild all of that every time.

The `sharelatex/sharelatex` image extends the base image and adds the actual Overleaf code
and services.

Use `make build-base` and `make build-community` from `server-ce/` to build these images.

We use the [Phusion base-image](https://github.com/phusion/baseimage-docker)
(which is extended by our `base` image) to provide us with a VM-like container
in which to run the Overleaf services. Baseimage uses the `runit` service
manager to manage services, and we add our init-scripts from the `server-ce/runit`
folder.


## Contributing

Please see the [CONTRIBUTING](CONTRIBUTING.md) file for information on contributing to the development of Overleaf.

## Authors

[The Overleaf Team](https://www.overleaf.com/about)

## License

The code in this repository is released under the GNU AFFERO GENERAL PUBLIC LICENSE, version 3. A copy can be found in the [`LICENSE`](LICENSE) file.

Copyright (c) Overleaf, 2014-2025.
