npm run lint

if [ $? -eq 0 ]; then
	echo "Debug führt zur Benennung der un-minifizierten bundles mit der Beschriftung \"min\", um mit der index.html zu funktionieren." 
	./node_modules/browserify/bin/cmd.js client/src/js/main.js -o client/src/build/main.min.js
	./node_modules/less/bin/lessc client/src/css/main.less client/src/build/main.min.css
else
    echo "linting failed"
fi