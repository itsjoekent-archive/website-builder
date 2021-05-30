#!/usr/bin/env bash

#https://github.com/kingkool68/generate-ssl-certs-for-local-development
# Make sure this script is run as root
if [ "$EUID" -ne 0 ] ; then
        echo "Please run as root. Try again by typing: sudo !!"
    exit
fi

function command_exists () {
    type "$1" &> /dev/null ;
}

# Make sure openssl exists
if ! command_exists openssl ; then
        echo "OpenSSL isn't installed. You need that to generate SSL certificates."
    exit
fi

name=$1
if [ -z "$name" ]; then
        echo "No name argument provided!"
        echo "Try ./generate-ssl.sh name.dev"
    exit
fi

## Make sure the tmp/ directory exists
if [ ! -d "tmp" ]; then
    mkdir tmp/
fi

## Make sure the certificates/ directory exists
if [ ! -d "certificates" ]; then
    mkdir certificates/
fi

# Cleanup files from previous runs
rm tmp/*
rm certificates/*

# Remove any lines that start with CN
sed -i '' '/^CN/ d' certificate-authority-options.conf
# Modify the conf file to set CN = ${name}
echo "CN = ${name}" >> certificate-authority-options.conf

# Generate Certificate Authority
openssl genrsa -des3 -passout pass:abc123 -out "tmp/${name}CA.key" 2048
openssl req -x509 -config certificate-authority-options.conf -new -passin pass:abc123 -nodes -key "tmp/${name}CA.key" -sha256 -days 365 -out "certificates/${name}CA.pem"

if command_exists security ; then
    # Delete trusted certs by their common name via https://unix.stackexchange.com/a/227014
    security find-certificate -c "${name}" -a -Z | sudo awk '/SHA-1/{system("security delete-certificate -Z "$NF)}'

    # Trust the Root Certificate cert
    security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain "certificates/${name}CA.pem"
fi

# Generate CA-signed Certificate
openssl genrsa -passout pass:abc123 -out "certificates/${name}.key" 2048
openssl req -new -config certificate-authority-options.conf -passin pass:abc123 -key "certificates/${name}.key" -out "tmp/${name}.csr"

# Generate SSL Certificate
openssl x509 -req -passin pass:abc123 -in "tmp/${name}.csr" -CA "certificates/${name}CA.pem" -CAkey "tmp/${name}CA.key" -CAcreateserial -out "certificates/${name}.crt" -days 365 -sha256 -extfile certificate-options.conf

# Cleanup a stray file
rm certificates/*.srl

# The username behind sudo, to give ownership back
user=$( who am i | awk '{ print $1 }')
chown -R "$user" tmp certificates

echo "All done! Check the certificates directory for your certs."
