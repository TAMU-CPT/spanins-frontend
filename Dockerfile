FROM quay.io/tamu_cpt/frontend-builder

ADD . /app
WORKDIR /app

RUN make node_modules && \
	npm rebuild node-sass && \
	make build && \
	cp *.html /output/ && \
	cp -Rv css /output/ && \
	cp -Rv build/ /output/ && \
	cp -Rv partials/ /output/ && \
	rm -rf build
