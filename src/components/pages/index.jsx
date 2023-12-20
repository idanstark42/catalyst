
export default function Index (props) {
  return <CollectionProvider {...props}>
    {(collection, loading) => <CollectionRenderer {...props} collection={collection} loading={loading} />}
  </CollectionProvider>
}

function CollectionProvider (props) {
  if (props.context) {
    return <ContextCollectionProvider {...props} />
  } else if (props.model) {
    return <RealmCollectionProvider {...props} />
  } else if (props.collection) {
    return props.children(props.collection, props.loading)
  }
}

function ContextCollectionProvider ({ context, ...props }) {
  const { data, loading } = context.use()
  const collection = data[props.collection]
  return props.children(collection, loading)
}

function RealmCollectionProvider ({ app, model, ...props }) {
  const [collection, setCollection] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      setCollection(await model.loadMany(app, {}, props.additionalFields))
      setLoading(false)
    })
  }, [setCollection])

  return props.children(collection, loading)
}

function CollectionRenderer ({ renderer = 'list', ...props }) {
  if (renderer instanceof Function) {
    return props.renderer(props)
  } else if (renderer === 'list') {
    return <CollectionList {...props} />
  } else if (renderer === 'cards') {
    return <CollectionCards {...props} />
  } else if (renderer === 'table') {
    return <CollectionTable {...props} />
  } else {
    return null
  }
}

function CollectionList ({ collection, loading, item, ...props }) {
  return <div className='collection-list'>
    {loading ? <Loading /> : collection.map((datum, index) => item(item, props))}
  </div>
}

function CollectionCards ({ collection, loading, item, ...props }) {
  return <div className='collection-cards'>
    {loading ? <Loading /> : collection.map((datum, index) => item(item, props))}
  </div>
}

function CollectionTable ({ collection, loading, item, ...props }) {
  return <div className='collection-table'>
    {loading ? <Loading /> : collection.map((datum, index) => item(item, props))}
  </div>
}

function Loading () {
  return <div className='loading'>Loading...</div>
}