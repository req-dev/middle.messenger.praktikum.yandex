export default abstract class BaseAPI {
  create(_data: unknown) { throw new Error('Not implemented'); }

  request(_data: unknown) { throw new Error('Not implemented'); }

  update(_data: unknown) { throw new Error('Not implemented'); }

  delete(_data: unknown) { throw new Error('Not implemented'); }
}
