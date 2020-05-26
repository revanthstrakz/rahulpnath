const path = require('path')
const Queries = require('./queries')
const createPaginatedPages = require('gatsby-paginate')

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  // Sometimes, optional fields tend to get not picked up by the GraphQL
  // interpreter if not a single content uses it. Therefore, we're putting them
  // through `createNodeField` so that the fields still exist and GraphQL won't
  // trip up. An empty string is still required in replacement to `null`.
  // eslint-disable-next-line default-case
  switch (node.internal.type) {
    case 'MarkdownRemark': {
      const { relativePath } = getNode(node.parent);
      const  slug = `/${relativePath.replace('.md', '').replace('.markdown', '')}/`;
      // Used to generate URL to view this content.
      createNodeField({
        node,
        name: 'slug',
        value: slug || '',
      });
    }
  }
};

exports.createPages = async ({ actions: { createPage }, graphql }) => {
  try {
    const postTemplate = path.resolve('./src/templates/post.js')
    const tagTemplate = path.resolve('./src/templates/tag.js')
    const tagPrefix = '/blog/tag/';
    const categoryPrefix = '/blog/category/';

    const { data, errors } = await graphql(Queries)

    createPaginatedPages({
      edges: data.posts.edges,
      createPage,
      pageTemplate: 'src/templates/blog.js',
      pageLength: 8,
      pathPrefix: 'blog/page',
    })

    // Create posts pages
    data.posts.edges.forEach(({ node: { fields: { slug } } }) => {
      createPage({
        path: slug,
        component: postTemplate,
      })
    })

    // Create tags pages
    data.tags.edges.forEach(({ node: { title } }) => {
      createPage({
        path: `${tagPrefix}${title}/`,
        component: tagTemplate,
        context: {
          slug: title,
        },
      })
    })

      // Create category pages
      data.tags.edges.forEach(({ node: { title } }) => {
        createPage({
          path: `${categoryPrefix}${title}/`,
          component: tagTemplate,
          context: {
            slug: title,
          },
        })
      })

    if (errors) {
      throw new Error(errors)
    }
  } catch (err) {
    console.log(err)
  }
}

exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    },
  })
}
