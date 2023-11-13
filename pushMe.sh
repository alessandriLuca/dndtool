#!/bin/bash

# Aggiungi e committa i cambiamenti
git add .
git commit -m "automatic push"
git push -u origin main
npm run deploy
