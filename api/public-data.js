const DATASETS = {
  'apt-trade': {
    url: 'https://apis.data.go.kr/1613000/RTMSDataSvcAptTradeDev/getRTMSDataSvcAptTradeDev',
    format: 'xml',
  },
  'apt-rent': {
    url: 'https://apis.data.go.kr/1613000/RTMSDataSvcAptRent/getRTMSDataSvcAptRent',
    format: 'xml',
  },
  'offi-trade': {
    url: 'https://apis.data.go.kr/1613000/RTMSDataSvcOffiTrade/getRTMSDataSvcOffiTrade',
    format: 'xml',
  },
  'offi-rent': {
    url: 'https://apis.data.go.kr/1613000/RTMSDataSvcOffiRent/getRTMSDataSvcOffiRent',
    format: 'xml',
  },
  subscription: {
    url: 'https://api.odcloud.kr/api/ApplyhomeInfoDetailSvc/v1/getAPTLttotPblancDetail',
    format: 'json',
  },
};

function first(value) {
  return Array.isArray(value) ? value[0] : value;
}

function isDigits(value, length) {
  return typeof value === 'string' && new RegExp(`^\\d{${length}}$`).test(value);
}

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const serviceKey = process.env.DATA_SERVICE_KEY;
  if (!serviceKey) {
    return res.status(500).json({ error: 'Public data API key is not configured' });
  }

  const datasetName = first(req.query.dataset);
  const dataset = DATASETS[datasetName];
  if (!dataset) {
    return res.status(400).json({ error: 'Unsupported dataset' });
  }

  const upstream = new URL(dataset.url);
  upstream.searchParams.set('serviceKey', serviceKey);

  if (datasetName === 'subscription') {
    const page = Number(first(req.query.page) || 1);
    const perPage = Number(first(req.query.perPage) || 100);
    if (!Number.isInteger(page) || page < 1 || page > 5 ||
        !Number.isInteger(perPage) || perPage < 1 || perPage > 100) {
      return res.status(400).json({ error: 'Invalid pagination' });
    }
    upstream.searchParams.set('page', String(page));
    upstream.searchParams.set('perPage', String(perPage));
  } else {
    const lawd = first(req.query.lawd);
    const ym = first(req.query.ym);
    const pageNo = Number(first(req.query.pageNo) || 1);
    const numOfRows = Number(first(req.query.numOfRows) || 1000);
    if (!isDigits(lawd, 5) || !isDigits(ym, 6) ||
        !Number.isInteger(pageNo) || pageNo < 1 || pageNo > 100 ||
        !Number.isInteger(numOfRows) || numOfRows < 1 || numOfRows > 1000) {
      return res.status(400).json({ error: 'Invalid query parameters' });
    }
    upstream.searchParams.set('LAWD_CD', lawd);
    upstream.searchParams.set('DEAL_YMD', ym);
    upstream.searchParams.set('pageNo', String(pageNo));
    upstream.searchParams.set('numOfRows', String(numOfRows));
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(upstream, {
      headers: { Accept: dataset.format === 'json' ? 'application/json' : 'application/xml' },
      signal: controller.signal,
    });
    const body = await response.text();

    res.setHeader('Content-Type', dataset.format === 'json'
      ? 'application/json; charset=utf-8'
      : 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(response.status).send(body);
  } catch (error) {
    console.error('Public data API request failed:', error);
    const timedOut = error && error.name === 'AbortError';
    return res.status(timedOut ? 504 : 502).json({
      error: timedOut ? 'Public data API request timed out' : 'Public data API request failed',
    });
  } finally {
    clearTimeout(timeout);
  }
};
