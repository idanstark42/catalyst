import Context from './context'

export default new Context({ loading: true }, {
    whileLoading: async (callback, value, setValue) => {
        await setValue({ ...value, loading: true })
        const result = await callback()
        await setValue({ ...value, loading: false })
        return result
    }
})
