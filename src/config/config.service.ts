import { Injectable } from '@nestjs/common';
import { ConfigLoaderService } from './config-loader.service';
import ProxyServer from 'http-proxy';

@Injectable()
export class ConfigService {
  constructor(private readonly config: ConfigLoaderService) {}

  getEnv(): string {
    return this.config.get('env');
  }

  getPort(): number {
    return this.config.get('webserver.port');
  }

  getDefaultApi(): string {
    return this.config.get('webserver.default_api');
  }

  getServices(): Array<any> {
    return this.config.get('webserver.services');
  }

  getNoAuthRoutes(): Array<any> {
    return this.config.get('webserver.noauth');
  }

  getLoggerGlobal(): { level } {
    return this.config.get('log');
  }

  getLoggerConsole(): { level } {
    const config = this.getLoggerGlobal();

    if (config.level) {
      return config;
    }

    return this.config.get('webserver.logger.console');
  }

  getLoggerCombined(): { level } {
    const config = this.getLoggerGlobal();

    if (config.level) {
      return config;
    }

    return this.config.get('webserver.logger.combined');
  }
}
