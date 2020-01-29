all:
	@echo "Available targets:"
	@echo "- deploy"

deploy:
	zola build
	rsync -avzhP public/ hardforze.binarytrance.com:infrastructure/volumes/www/wezm.net/v2/
