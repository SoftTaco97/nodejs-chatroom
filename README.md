# Node.js Chat Room


## Overview

A simple command line chat room that allows users on your network to communicate with eachother via your chat room server.

This project uses no external dependencies, just built the built in modules; `net`, and `os`.

## Requirements

**Server requirements:**

1. Node.js v12 or greater. 

**Client requirements:** 

1. Some sort of way to establish a connection to server. 
   - I prefer using `netcat` or `nc`

## Set up

1. Clone repo to local machine

## Running / usage

**Server:**
1. Change directories to `path/of/project/on/machine/`
2. Run `node chat.js` 
3. Collect server broadcast address from console message
   - `Chat listening on xx.xx.x.xxx:7500`

**Client:**
1. Collect server broadcast address from server admin. 
   - `xx.xx.x.xxx:7500`
2. Run `nc xx.xx.x.xxx 7500`
   - Tweak to fit the command you are using if not using netcat.
 
