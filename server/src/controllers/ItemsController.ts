import { Request, Response } from 'express';
import knex from '../database/connection';

class ItemsController {
    async index (request: Request, response: Response) {
            const items = await knex('items').select('*');
        
            const serializedItems = items.map(item => {
                return {
                    id: item.id,
                    title: item.title, 
                    image_url: `http://192.168.15.16:3333/image_items/${item.image}`
                }
            });
        
            return response.json(serializedItems);
    }

    async show (request: Request, response: Response) {
        const { id } = request.params;

        const item = await knex('items').where('id', id).first();

        if (!item) {
            return response.status(400).json({message:'Item not found.'});
        };

        return response.json(item);
    };
};

export default ItemsController;