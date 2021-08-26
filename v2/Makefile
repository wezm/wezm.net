all:
	@echo "Available targets:"
	@echo "- deploy"

deploy:
	zola build
	rsync -avzhP --delete public/ hardforze.binarytrance.com:infrastructure/volumes/www/wezm.net/v2/
