Enhance object methods with hooks. 

#### Before method is called:
```js
const data = { sayHello: () => {} };

const wrapped = enhancify(data)
                  .before('sayHello', ({ propKey, args}) => { 
                    logger.info('calling ', propKey, 'with args', args);
                  })
                  .build();

wrapped.sayHello('hi', 'there'); // calling sayHello with args ['hi', 'there']
```

#### Usefull for 

- Logging
- Elastic search
- Event dispatching
- Analytics
- Metrics
- Caching


#### Example
```js
const enhancify = require('enhancify');

const contactService = { 
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

const contact = enhancify(contactService)
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

contact.create({ name: "Paul" });
contact.update( name: "Paul", id: "1" });
contact.read({ id: "1" });
```


#### TODO

- [] On error hook
- [] On missing method
- [] Ossify / Freeze object
- [] Regex pattern