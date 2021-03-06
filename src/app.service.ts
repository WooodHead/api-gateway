import { HttpService, Injectable } from '@nestjs/common';
import { ProxyService } from './proxy/proxy.service';
import Bluebird from 'bluebird';
import util from 'util';
import fs from 'fs';

@Injectable()
export class AppService {
  constructor(
    private readonly proxyService: ProxyService,
    private readonly httpService: HttpService,
  ) {}

  async info(): Promise<any> {
    const services = await this.getAllServicesInfo('');
    const data = JSON.parse(await util.promisify(fs.readFile)('package.json', { encoding: 'utf8' }));

    const info = {
      name: data.name,
      version: data.version,
      description: data.description,
      services,
    };

    return info;
  }

  async getAllServicesInfo(env): Promise<any> {
    const apis = this.proxyService.getAllUrls(env);

    const services = {};
    for (const key of Object.keys(apis)) {
      try {
        services[key] = (await this.httpService.get(apis[key]).toPromise()).data;
      } catch (e) {
        services[key] = { error: 'Not running'};
      }
    }

    return services;
  }
}
