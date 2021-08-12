#!/usr/bin/env node

import express from 'express';
import chalk from 'chalk';
import boxen from 'boxen';
import { generatePDF, generatePDFOptions } from './mr-pdf/utils';
import {
  commaSeparatedList,
  generatePuppeteerPDFMargin,
} from './mr-pdf/generators';
const app = express();
const port = process.env.PORT ? process.env.PORT : 80;

app.use(express.urlencoded());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ projectName: 'mrpdf-express' });
});

app.get('/api/v1', function (req, res) {
  const options: generatePDFOptions | any = {
    initialDocURLs: commaSeparatedList(req.query.initialDocURLs),
    excludeURLs: commaSeparatedList(req.query.excludeURLs),
    contentSelector: req.query.contentSelector,
    paginationSelector: req.query.paginationSelector,
    excludeSelectors: commaSeparatedList(req.query.excludeSelectors),
    cssStyle: req.query.cssStyle,
    outputPDFFilename: req.query.outputPDFFilename,
    pdfMargin: generatePuppeteerPDFMargin(req.query.pdfMargin),
    pdfFormat: req.query.pdfFormat,
    coverTitle: req.query.coverTitle,
    coverImage: req.query.coverImage,
  };
  generatePDF(options).then((pdf) => {
    console.log(chalk.red('\nEND'));
    const filename = req.body.outputPDFFilename
      ? req.body.outputPDFFilename
      : 'mrPDF_Express.pdf';
    const download = req.query.dl ? 'attachment' : 'inline';
    res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `${download}; filename=${filename}`,
      'Content-Length': Buffer.byteLength(pdf),
    });
    res.end(pdf);
  });
});

app.post('/api/v1/', function (req, res) {
  const options: generatePDFOptions = {
    initialDocURLs: commaSeparatedList(req.body.initialDocURLs),
    excludeURLs: commaSeparatedList(req.body.excludeURLs),
    contentSelector: req.body.contentSelector,
    paginationSelector: req.body.paginationSelector,
    excludeSelectors: commaSeparatedList(req.body.excludeSelectors),
    cssStyle: req.body.cssStyle,
    outputPDFFilename: req.body.outputPDFFilename,
    pdfMargin: generatePuppeteerPDFMargin(req.body.pdfMargin),
    pdfFormat: req.body.pdfFormat,
    coverTitle: req.body.coverTitle,
    coverImage: req.body.coverImage,
  };
  const filename = req.body.outputPDFFilename
    ? req.body.outputPDFFilename
    : 'mrPDF_Express.pdf';
  generatePDF(options).then((pdf) => {
    console.log(chalk.red('\nEND'));
    res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=${filename}`,
      'Content-Length': Buffer.byteLength(pdf),
    });
    res.end(pdf);
  });
});

app.listen(port, () => {
  console.log(
    boxen(
      chalk.green(`Server started at http://<ip-address>:${chalk.red(port)}`),
      {
        padding: 1,
        margin: 1,
        borderStyle: 'classic',
      },
    ),
  );
});
