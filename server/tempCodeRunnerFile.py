def get_estimated_price(location, sqft, bhk, bath):
    try:
        loc_index = __data_columns.index(location)

    except:
        loc_index = -1

    x = np.zeros(len(__data_columns))
    x[0] = sqft
    x[1] = bath
    x[2] = bhk
    if loc_index >= 0:
        x[loc_index] = 1

    X_df = pd.DataFrame([x], columns=__data_columns)
    return round(__model.predict(X_df)[0], 2)