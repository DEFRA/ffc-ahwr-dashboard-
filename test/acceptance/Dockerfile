ARG PARENT_VERSION=2.3.0-node22.4.0
ARG PORT_DEBUG=9229

# Development
FROM defradigital/node-development:${PARENT_VERSION}
ARG PARENT_VERSION
LABEL uk.gov.defra.ffc.parent-image=defradigital/node-development:${PARENT_VERSION}
ARG PORT_DEBUG
EXPOSE ${PORT_DEBUG}
COPY --chown=node:node package*.json ./
RUN npm install --ignore-scripts
COPY wdio.conf.js ./
COPY --chown=node:node . .
CMD [ "npm", "run", "test-ci" ]