#!/bin/bash
echo "========================================="
echo "  CognitivePath Interactive Prototype"
echo "========================================="
echo ""
echo "Starting local web server..."
echo ""
cd "$(dirname "$0")"
python3 -m http.server 8000
