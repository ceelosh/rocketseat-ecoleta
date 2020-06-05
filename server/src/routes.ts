import express from 'express';
import knex from './database/connection';

const routes =  express.Router();

routes.get('/items', async (req, res) => {
    const items = await knex('items').select('*');
    const serializedItems = items.map(item => {
        return {
            id: item.id,
            titulo: item.title,
            imagem_url: `http://localhost:3333/uploads/${item.image}`
        };
    })
    return res.json(serializedItems);
});

routes.post('/items', async (req, res) => {
    // desestrutura o request
    const { name, email, whatsapp, lat, long, city, uf, items } = req.body;
    
    // insere o ponto de coleta no banco
    const insertedId = await knex('points').insert({name, email, whatsapp, lat, long, city, uf, image:'fake'});
    
    // prepara os items enviado no request para serem inseridos no banco
    const pointsItems = items.map((item_id: Number) => { return {item_id, point_id: insertedId[0]}});

    // insere na tabela points_items os items enviado no request body(JSON)
    await knex('points_items').insert(pointsItems);
    
    // return 
    return res.json({success: true})

});

export default routes;