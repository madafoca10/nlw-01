import { Request, Response } from 'express';
import knex from '../database/connection';

class PointsController {
    async index (request: Request, response: Response) {
        const { city, uf, items } = request.query;
        
        const parsedItems = String(items)
        .split(',')
        .map(item => Number(item.trim()));

        const points = await knex('points')
        .join('points_items', 'points.id', '=', 'points_items.id_points')
        .whereIn('points_items.id_items', parsedItems)
        .where('city', String(city))
        .where('uf', String(uf) )
        .distinct()
        .select('points.*');

        const serializedPoints = points.map(point => {
            return {
                ...points,
                image_url: `http://192.168.15.16:3333/image_points/${point.image}`
            }
        });

        return response.json(serializedPoints);
    };

    async show (request: Request, response: Response) {
        const { id } = request.params;

        const point = await knex('points').where('id', id).first();

        if (!point) {
            return response.status(400).json({message:'Point not found.'});
        };

        const serializedPoint = {
            ...point,
            image_url: `http://192.168.15.16:3333/image_points/${point.image}`
        };

        const items = await knex('items')
        .join('points_items', 'items.id', '=', 'points_items.id_items')
        .where('points_items.id_points', id)
        .select('items.*');

        return response.json({ point: serializedPoint , items });
    };

    async create (request: Request, response: Response) {
        const {
            title,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = request.body;
    
        const trx = await knex.transaction();

        const point = {
            title,
            image: request.file.filename,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf        
};
    
        const insertedIds = await trx('points').insert(point);

        const pointItems = items
            .split(',')
            .map((item: string) => Number(item.trim()))
            .map((item_id:number) => {
            return {
                id_points: insertedIds[0],
                id_items: item_id
            };
        });
    
        await trx('points_items').insert(pointItems);

        await trx.commit();

        return response.json({
            id: insertedIds,
            ...point, 
        });


    }
}

export default PointsController;