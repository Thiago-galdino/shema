export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Shema Church API',
    version: '1.0.0',
    description: 'API de gestão da Igreja Batista Shema — membros, células, eventos e feed.',
  },
  servers: [{ url: '/api', description: 'API Principal' }],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    },
    schemas: {
      Member: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          phone: { type: 'string' },
          whatsapp: { type: 'string' },
          email: { type: 'string', format: 'email' },
          status: { type: 'string', enum: ['visitante', 'membro', 'lider', 'discipulado'] },
          ministry: { type: 'string' },
          photo: { type: 'string' },
          birthDate: { type: 'string', format: 'date' },
          baptismDate: { type: 'string', format: 'date' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Cell: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string' },
          leader: { $ref: '#/components/schemas/Member' },
          members: { type: 'array', items: { $ref: '#/components/schemas/Member' } },
          meetingDay: { type: 'string', enum: ['domingo','segunda','terca','quarta','quinta','sexta','sabado'] },
          meetingTime: { type: 'string', example: '19:30' },
          location: { type: 'string' },
        },
      },
      Event: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          type: { type: 'string', enum: ['culto','conferencia','reuniao','celula','treinamento','outro'] },
          date: { type: 'string', format: 'date-time' },
          location: { type: 'string' },
        },
      },
      Post: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          content: { type: 'string' },
          mediaUrl: { type: 'string' },
          mediaType: { type: 'string', enum: ['image', 'video'] },
          isPinned: { type: 'boolean' },
          likes: { type: 'array', items: { type: 'string' } },
          comments: { type: 'array', items: { type: 'object', properties: { text: { type: 'string' }, author: { type: 'object' } } } },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Error: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string' },
        },
      },
    },
    responses: {
      Unauthorized: { description: 'Token ausente ou inválido', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      NotFound: { description: 'Recurso não encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      BadRequest: { description: 'Dados inválidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
    },
  },
  security: [{ bearerAuth: [] }],
  paths: {
    '/auth/login': {
      post: {
        tags: ['Auth'], summary: 'Login', security: [],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['email','password'], properties: { email: { type: 'string', format: 'email' }, password: { type: 'string' } } } } } },
        responses: {
          200: { description: 'Login realizado', content: { 'application/json': { schema: { type: 'object', properties: { success: { type: 'boolean' }, accessToken: { type: 'string' }, user: { type: 'object' } } } } } },
          401: { $ref: '#/components/responses/Unauthorized' },
        },
      },
    },
    '/auth/logout': {
      post: { tags: ['Auth'], summary: 'Logout', responses: { 200: { description: 'Logout realizado' } } },
    },
    '/auth/refresh': {
      post: { tags: ['Auth'], summary: 'Renovar access token via cookie', security: [], responses: { 200: { description: 'Token renovado', content: { 'application/json': { schema: { type: 'object', properties: { accessToken: { type: 'string' } } } } } } } },
    },
    '/auth/me': {
      get: { tags: ['Auth'], summary: 'Retorna dados do usuário autenticado', responses: { 200: { description: 'Usuário autenticado' }, 401: { $ref: '#/components/responses/Unauthorized' } } },
    },
    '/members': {
      get: { tags: ['Membros'], summary: 'Listar membros', parameters: [{ name: 'search', in: 'query', schema: { type: 'string' } }, { name: 'status', in: 'query', schema: { type: 'string' } }, { name: 'page', in: 'query', schema: { type: 'integer' } }, { name: 'limit', in: 'query', schema: { type: 'integer' } }], responses: { 200: { description: 'Lista de membros' } } },
      post: { tags: ['Membros'], summary: 'Criar membro', requestBody: { required: true, content: { 'multipart/form-data': { schema: { type: 'object', required: ['name'], properties: { name: { type: 'string' }, status: { type: 'string' }, phone: { type: 'string' }, email: { type: 'string' }, photo: { type: 'string', format: 'binary' } } } } } }, responses: { 201: { description: 'Membro criado' }, 400: { $ref: '#/components/responses/BadRequest' } } },
    },
    '/members/{id}': {
      get: { tags: ['Membros'], summary: 'Buscar membro por ID', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Membro encontrado' }, 404: { $ref: '#/components/responses/NotFound' } } },
      put: { tags: ['Membros'], summary: 'Atualizar membro', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Membro atualizado' } } },
      delete: { tags: ['Membros'], summary: 'Remover membro (soft delete)', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Membro removido' } } },
    },
    '/members/export': {
      get: { tags: ['Membros'], summary: 'Exportar membros em CSV', responses: { 200: { description: 'Arquivo CSV', content: { 'text/csv': {} } } } },
    },
    '/cells': {
      get: { tags: ['Células'], summary: 'Listar células', responses: { 200: { description: 'Lista de células' } } },
      post: { tags: ['Células'], summary: 'Criar célula', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['name'], properties: { name: { type: 'string' }, description: { type: 'string' }, meetingDay: { type: 'string' }, meetingTime: { type: 'string' }, location: { type: 'string' } } } } } }, responses: { 201: { description: 'Célula criada' } } },
    },
    '/cells/{id}': {
      get: { tags: ['Células'], summary: 'Buscar célula por ID', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Célula encontrada' }, 404: { $ref: '#/components/responses/NotFound' } } },
      put: { tags: ['Células'], summary: 'Atualizar célula', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Célula atualizada' } } },
      delete: { tags: ['Células'], summary: 'Remover célula', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Célula removida' } } },
    },
    '/cells/{id}/frequency': {
      post: { tags: ['Células'], summary: 'Registrar frequência', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['date'], properties: { date: { type: 'string', format: 'date' }, attendees: { type: 'array', items: { type: 'string' } }, notes: { type: 'string' } } } } } }, responses: { 200: { description: 'Frequência registrada' } } },
    },
    '/events': {
      get: { tags: ['Eventos'], summary: 'Listar eventos', parameters: [{ name: 'type', in: 'query', schema: { type: 'string' } }, { name: 'from', in: 'query', schema: { type: 'string', format: 'date' } }, { name: 'to', in: 'query', schema: { type: 'string', format: 'date' } }], responses: { 200: { description: 'Lista de eventos' } } },
      post: { tags: ['Eventos'], summary: 'Criar evento', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['title','date'], properties: { title: { type: 'string' }, type: { type: 'string' }, date: { type: 'string', format: 'date-time' }, location: { type: 'string' }, description: { type: 'string' } } } } } }, responses: { 201: { description: 'Evento criado' } } },
    },
    '/events/{id}': {
      get: { tags: ['Eventos'], summary: 'Buscar evento por ID', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Evento encontrado' }, 404: { $ref: '#/components/responses/NotFound' } } },
      put: { tags: ['Eventos'], summary: 'Atualizar evento', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Evento atualizado' } } },
      delete: { tags: ['Eventos'], summary: 'Remover evento', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Evento removido' } } },
    },
    '/events/{id}/checkin': {
      post: { tags: ['Eventos'], summary: 'Fazer check-in em evento', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Check-in realizado' } } },
    },
    '/posts': {
      get: { tags: ['Feed'], summary: 'Listar posts do feed', parameters: [{ name: 'page', in: 'query', schema: { type: 'integer' } }, { name: 'limit', in: 'query', schema: { type: 'integer' } }], responses: { 200: { description: 'Posts do feed' } } },
      post: { tags: ['Feed'], summary: 'Criar post', requestBody: { required: true, content: { 'multipart/form-data': { schema: { type: 'object', required: ['content'], properties: { content: { type: 'string' }, media: { type: 'string', format: 'binary' }, isPinned: { type: 'boolean' } } } } } }, responses: { 201: { description: 'Post criado' } } },
    },
    '/posts/{id}/like': {
      post: { tags: ['Feed'], summary: 'Curtir / descurtir post', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Like alternado' } } },
    },
    '/posts/{id}/comments': {
      post: { tags: ['Feed'], summary: 'Comentar em post', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['text'], properties: { text: { type: 'string' } } } } } }, responses: { 200: { description: 'Comentário adicionado' } } },
    },
    '/dashboard': {
      get: { tags: ['Dashboard'], summary: 'KPIs, gráficos e resumos', responses: { 200: { description: 'Dados do dashboard' } } },
    },
    '/dashboard/upcoming-events': {
      get: { tags: ['Dashboard'], summary: 'Próximos eventos', responses: { 200: { description: 'Lista de eventos futuros' } } },
    },
  },
};
