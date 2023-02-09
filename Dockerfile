FROM public.ecr.aws/lambda/nodejs:14

COPY index.js package.json  ${LAMBDA_TASK_ROOT}/
COPY service/ ./service/
COPY utils/ ./utils/
COPY dbOperations/ ./dbOperations

RUN npm install

CMD ["index.handler"]