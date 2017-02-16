.PHONY: npm
npm:
	@npm install

.PHONY: venv
venv:
	@virtualenv venv
	@venv/bin/pip install -r requirements.txt

.PHONY: clean-libs
clean-libs:
	rm -rf venv
	rm -rf node_modules

.PHONY: rebulid-venv
rebuild-libs: clean-libs venv npm

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

.PHONY: isort
isort:
	sh -c "isort --recursive ."

.PHONY: lint
lint:
	flake8

.PHONY: clean
clean:
	@find ./ -name "*.pyc" -exec rm -f {} \;
	@find ./ -name "*.pyo" -exec rm -f {} \;
	@find ./ -name "*~" -exec rm -f {} \;
	@find ./ -name "__pycache__" -exec rm -f {} \;
