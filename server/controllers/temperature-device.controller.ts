import express = require('express');
import {ITemperatureDeviceDocument, TemperatureDeviceModel} from '../models/temperature-device.model';
import {ITemperatureDevice} from '../entities/device.interface';
import {GenericController} from './generic.controller';
import {TemperatureDataController} from "./temperature-data.controller";
import {SocketService} from "../socket/socket-service";
import {Engine} from '../logic/engine';

export class TemperatureDeviceController extends GenericController<ITemperatureDevice, ITemperatureDeviceDocument> {
  constructor(socketService: SocketService) {
    super(socketService,
      "/temperature",
      TemperatureDeviceModel,
      c => new TemperatureDeviceModel(c),
      (d, i) => TemperatureDeviceController.updateDocument(d, i),
      id => new TemperatureDataController(socketService).deleteAllById(id),
      true,
    );
  }

  private static updateDocument(documentFromDb: ITemperatureDeviceDocument, inputDocument: ITemperatureDeviceDocument) {
    documentFromDb.name = inputDocument.name;
    documentFromDb.port = inputDocument.port;
  }

  protected informOnAdd(device: ITemperatureDeviceDocument): void {
    Engine.getInstance().addTemperatrueDevice(device);
  }

}
