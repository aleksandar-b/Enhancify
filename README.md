```js

const enhancify = require('enhancify');

const contact = { 
  create: (record) => { 
    return contactRepository.create(record);
  },
  update: (record) => {
    return contactRepository.update(record);
  },
  read () {
    return contactRepository.read(record);
  },
};

const contactService = enhancify(contact)
                .before('*', (data) => {
                   logger.info('invoking', data.propKey, 'with args', data.args);
                 })
                .after('*', ({ result }) => {
                   cache.set(result.id, result);
                 })
                .before('create', ({ args }) => {
                   metrics.createContact(userId, 'applying_discount_code');
                 })
                .after('create', () => {
                   metrics.createContact(userId, 'discount_code_applied');
                 })
                .after('create', () => {
                   analytics.send(userId, 'created_contact');
                })
                .after('create', (data) => {
                   elasticSearch.indexPost(data.result);
                 })
                .after('create', (data) => {
                   pubsub.emit('contact_created', data.result.id);
                 })
                .build();

contactService.create({ name: "Paul" });
contactService.update( name: "Paul", id: "1" });
contactService.read({ id: "1" });
```