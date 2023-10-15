import { openDB } from 'idb'

async function createIndexedDB() {
	const db = await openDB('diabet-dairy', 1, {
		upgrade(db, oldVersion, newVersion, transaction) {
			switch (oldVersion) {
				case 0:
				case 1:
					const store = db.createObjectStore('records', {
						keyPath: 'id',
					})
			}
		},
	})
	return db
}
