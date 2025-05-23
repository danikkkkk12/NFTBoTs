const { MongoClient, ObjectId } = require('mongodb');
const { spawn } = require('child_process');
const path = require('path');

exports.orderGift = async (telegramId, winGiftId) => {
    const client = new MongoClient(process.env.MONGODB_URI);

    try {
        await client.connect();
        const db = client.db();

        // 1. Проверяем доступность подарка
        const winningGift = await db.collection('WinningGift').findOne({
            _id: new ObjectId(winGiftId),
            telegramId: telegramId,
            status: 'Pending'
        });

        if (!winningGift) {
            return { order: "Подарок больше недоступен" };
        }

        // 2. Создаём заказ
        const orderResult = await db.collection('OrderWinGift').insertOne({
            winningGiftId: new ObjectId(winGiftId),
            telegramId: telegramId,
            status: 'Pending',
            createdAt: new Date()
        });

        if (!orderResult.insertedId) {
            return { order: "Ошибка при создании заказа" };
        }

        // 3. Обновляем статус подарка
        const updateResult = await db.collection('WinningGift').updateOne(
            { _id: new ObjectId(winGiftId), telegramId: telegramId },
            { $set: { status: 'Ordered' } }
        );

        if (updateResult.modifiedCount === 0) {
            return { order: "Не удалось обновить статус подарка" };
        }

        // 4. Получаем название подарка
        const gift = await db.collection('Gifts').findOne({ 
            _id: winningGift.giftId 
        });

        if (!gift) {
            return { order: "Не удалось получить информацию о подарке" };
        }

        // 5. Запуск Python-скрипта
        const scriptPath = path.resolve(__dirname, '../../python/sendGift.py');
        const python = spawn('python3', [scriptPath, telegramId.toString(), gift.name]);

        python.stdout.on('data', data => console.log(`stdout: ${data}`));
        python.stderr.on('data', data => console.error(`stderr: ${data}`));
        python.on('close', code => console.log(`sendGift.py завершён с кодом ${code}`));

        return { order: "Заказ оформлен" };

    } catch (err) {
        console.error('Ошибка в orderGift:', err);
        return { order: "Произошла ошибка при заказе" };
    } finally {
        await client.close();
    }
};
