npm run lint

if [ $? -eq 0 ]; then
	echo "Debug führt zur Benennung der un-minifizierten bundles mit der Beschriftung \"min\", um mit der index.html zu funktionieren." 
	./node_modules/browserify/bin/cmd.js src/client_js/*.js -o build/main.min.js
	./node_modules/less/bin/lessc src/styles/*.less build/main.min.css
else
    echo "linting failed"
fi