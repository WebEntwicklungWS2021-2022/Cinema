npm run lint

if [ $? -eq 0 ]; then
	./node_modules/browserify/bin/cmd.js src/client_js/*.js -o build/main.js
	./node_modules/less/bin/lessc --clean-css src/styles/main.less build/main.min.css
	./node_modules/terser/bin/terser build/main.js --compress --mangle --comments=false -o build/main.min.js
	rm build/main.js 
else
    echo "linting failed"
fi