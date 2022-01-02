import Boom from '@hapi/boom';
import Joi from '@hapi/joi';
import axios from 'axios';
import { pick, toNumber, toString } from 'lodash';

import { apiHandler } from '../../utils/api';

const API_URL = 'https://qa-interview-test.splytech.dev/api/drivers';

type DriverLocation = {
  latitude: number,
  longitude: number,
  bearing: number,
};

type Driver = {
  driver_id: string,
  location: DriverLocation,
};

type ResponseData = {
  pickup_eta: number,
  drivers: Driver[],
};

export default apiHandler().get(async (req, res) => {
  const params = pick(req.query, ['latitude', 'longitude', 'count']);

  const schema = Joi.object({
    latitude: Joi.number().optional(),
    longitude: Joi.number().optional(),
    count: Joi.number().optional(),
  });

  const validation = schema.validate(params);

  if (validation.error) {
    throw Boom.badRequest(`Invalid request: ${validation.error}`);
  }

  try {
    const response = await axios.get<ResponseData>(API_URL, { params });

    // const drivers = DUMP_DATA.drivers
    const drivers = response.data && Array.isArray(response.data.drivers) ? response.data.drivers : [];

    const result = drivers
      .map(row => ({
        id: toString(row.driver_id),
        lat: toNumber(row.location.latitude),
        lng: toNumber(row.location.longitude),
      }))
      .filter(row => row.id);

    res.status(200).json(result);
  } catch(err: any) {
    throw Boom.notFound(err);
  }
})
