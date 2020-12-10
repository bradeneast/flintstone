exports.handler = async (event, context) => {
  const { identity, user } = context.clientContext;

  return await user.update({
    app_metadata: {
      flintstone: JSON.parse(event.body.flintstone)
    }
  })

}