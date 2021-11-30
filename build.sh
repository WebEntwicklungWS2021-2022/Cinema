npm run lint

if [ $? -eq 0 ]; then
	./node_modules/browserify/bin/cmd.js client/src/js/main.js -o client/src/build/main.js
	./node_modules/less/bin/lessc --clean-css client/src/css/main.less client/src/build/main.min.css
	./node_modules/terser/bin/terser client/src/build/main.js --compress --mangle --comments=false -o client/src/build/main.min.js
	rm client/src/build/main.js 
else
    echo "linting failed"
fi