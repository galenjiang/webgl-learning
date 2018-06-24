export default async(vert, frag) => {
    const [fragRes, vertRes] = await Promise.all([
        fetch(vert),
        fetch(frag),
    ])
    return Promise.all([fragRes.text(), vertRes.text()])
}

