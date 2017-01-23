'use strict';

import {logger} from '../utils/logger';
import express = require('express');
import {IBlindsDeviceDocument, BlindsDeviceModel} from '../models/blinds-device.model';
import {IBlindsDevice} from '../entities/device.interface';
import {RequestContainer, ResponseContainer, ResponseCollectionContainer} from '../wire/com-container';
import {cleanupBlindsData} from './blinds-data.controller';

export function addBlindsDevice(req: express.Request, res: express.Response, next: express.NextFunction) {
  let requestContent: RequestContainer<IBlindsDevice> = req.body;
  let device: IBlindsDeviceDocument = new BlindsDeviceModel(requestContent.content);
  logger.info(`create blinds-device: ${JSON.stringify(requestContent)}`);
  device.save((err: any, addedDevice: IBlindsDeviceDocument) => {
    if (err) {
      res.status(500).json({error: `error creating blinds-device ${device.name}. ${err}`});
    } else {
      // set the id to the _id provided by the db
      device.id = addedDevice._id;
      logger.debug(`created blinds-device successfully, id: ${addedDevice.id}`);
      let responseContent: ResponseContainer<IBlindsDevice> = new ResponseContainer<IBlindsDevice>(device);
      res.status(201).json(responseContent);
    }
  });
};

export function updateBlindsDevice(req: express.Request, res: express.Response, next: express.NextFunction) {
  let id = req.params.id;
  logger.info(`update blinds-device [${id}]: ${JSON.stringify(req.body)}`);
  BlindsDeviceModel.findById(id, (err: any, deviceFromDb: IBlindsDeviceDocument) => {
    if (err) {
      res.status(404).json({error: `blinds-device ${id} not found. ${err}`});
    } else {
      let requestContent: RequestContainer<IBlindsDevice> = req.body;
      let device: IBlindsDeviceDocument = new BlindsDeviceModel(requestContent.content);
      // copy the properties
      deviceFromDb.name = device.name;
      deviceFromDb.keyUp = device.keyUp;
      deviceFromDb.keyDown = device.keyDown;
      deviceFromDb.actorUp = device.actorUp;
      deviceFromDb.actorDown = device.actorDown;
      deviceFromDb.runningSeconds = device.runningSeconds;
      // save the updated user
      deviceFromDb.save((err: any, updatedDevice: IBlindsDeviceDocument) => {
        if (err) {
          res.status(500).json({error: `error updating blinds-device ${id}. ${err}`});
        } else {
          logger.debug('updated blinds-device successfully');
          let responseContent: ResponseContainer<IBlindsDevice> = new ResponseContainer<IBlindsDevice>(updatedDevice);
          res.json(responseContent);
        }
      });
    }
  });
}

export function getAllBlindsDevices(req: express.Request, res: express.Response, next: express.NextFunction) {
  BlindsDeviceModel.find((err: any, devices: IBlindsDeviceDocument[]) => {
    if (err) {
      res.status(404).json({error: `error retrieving blinds-devices. ${err}`});
    } else {
      // set the id to the _id provided by the db
      devices.forEach((device) => device.id = device._id);
      logger.debug(`found ${devices.length} blinds-devices`);
      let responseContentCollection: ResponseCollectionContainer<IBlindsDevice> = new ResponseCollectionContainer<IBlindsDevice>(devices);
      res.json(responseContentCollection);
    }
  });
}

export function getBlindsDevice(req: express.Request, res: express.Response, next: express.NextFunction) {
  logger.debug(`get blinds-device ${req.params.id}`);
  let ref = {_id: req.params.id};
  BlindsDeviceModel.findById(ref, (err: any, device: IBlindsDeviceDocument) => {
    if (err) {
      res.status(404).json({error: `error retrieving blinds-device ${ref._id}. ${err}`});
    } else {
      // set the id to the _id provided by the db
      device.id = device._id;
      logger.debug(`found blinds-device ${req.params.id}: ${JSON.stringify(device)}`);
      let responseContent: ResponseContainer<IBlindsDevice> = new ResponseContainer<IBlindsDevice>(device);
      res.json(responseContent);
    }
  });
}

export function deleteBlindsDevice(req: express.Request, res: express.Response, next: express.NextFunction) {
  logger.info(`delete blinds-device ${req.params.id}`);
  let ref = {_id: req.params.id};
  BlindsDeviceModel.remove(ref, (err: any) => {
    if (err) {
      res.status(404).json({error: `error deleting blinds-device ${ref._id}. ${err}`});
    }
    logger.debug(`deleted blinds-device ${req.params.id} successfully`);
    cleanupBlindsData(req.params.id);
    res.json(ref._id);
  });
}


