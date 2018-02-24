tags :: 
	rm -f TAGS;
	find ./app/ -name "*.js" | xargs etags -a
	find ./resource/ng/ -name "*.js" \
	-o -name "*.css" \
	-o -name "*.scss" \
	-o -name "*.html" | xargs etags -a
