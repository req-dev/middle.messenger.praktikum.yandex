import queryStringify from '../queryStringify';

describe('queryStringify', () => {

  it('should return an empty string', () => {
    const result = queryStringify({});

    expect(result).toEqual('');
  });

  it('should stringify an object to a URL query', () => {
    const result = queryStringify({
      category: 'tools',
      article: 'how-to-create-a-website',
      page: 1,
      textSize: 10,
      query: 'nginx',
    });

    expect(result).toEqual('category=tools&article=how-to-create-a-website&page=1&textSize=10&query=nginx');
  });

});
