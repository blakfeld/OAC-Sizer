.PHONY: npm
npm:
	@npm install


.PHONY: venv
venv:
	@virtualenv venv
	@venv/bin/pip install -r requirements.txt


.PHONY: build-libs
build-libs: venv npm


.PHONY: rebulid-libs
rebuild-libs: clean-libs venv npm


.PHONY: clean-libs
clean-libs:
	rm -rf venv
	rm -rf node_modules


.PHONY: clean-build
clean-build:
	rm -rf build/
	rm -rf dist/
	rm -rf *.egg-info


.PHONY: run
run:
	venv/bin/python app/run.py


.PHONY: run-production
run-production:
	venv/bin/python app/run.py --production


.PHONY: clean
clean: clean-libs clean-build
	@find ./ -name "*.pyc" -exec rm -f {} \;
	@find ./ -name "*.pyo" -exec rm -f {} \;
	@find ./ -name "*~" -exec rm -f {} \;
	@find ./ -name "__pycache__" -exec rm -f {} \;


.PHONY: docker-build
docker-build:
	docker build -t corwinbrown/oac_sizer .


.PHONY: docker-run
docker-run:
	docker run --env-file $(env-file) -p 9001:9001 --rm corwinbrown/oac_sizer


.PHONY: docker
docker: docker-build docker-run


.PHONY: dist
dist: clean-build clean-libs clean
	mkdir dist
	zip -r dist/oac_sizer . -x ".git/*" -x "secrets/*" -x "dist/*"
