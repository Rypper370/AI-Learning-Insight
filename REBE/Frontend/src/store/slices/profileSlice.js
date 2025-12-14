import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUserLogged } from '../../utils/api';

export const getProfile = createAsyncThunk(
    'profile/getProfile',
    async(_, { rejectWithValue }) => {
        try {
            const result = await getUserLogged();
            return result.data;
        } catch(err) {
            return rejectWithValue(err?.message || 'Failed to fetch profile');
        }
    }
);


const profileSlice = createSlice({
    name: 'profile',
    initialState: {
        data: null,
        status: 'idle',
        error: null
    },
    reducers: {
        clearProfile(state) {
            state.data = null;
            state.status = 'idle';
            state.error = null;
        }
    },
    extraReducers(builder) {
        builder
            .addCase(getProfile.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(getProfile.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload || action.error?.message;
                state.data = null;
            })
            .addCase(getProfile.fulfilled, (state, action) => {
                state.status = 'succeded';
                state.data = action.payload;
            })
    }
});

export const { clearProfile } = profileSlice.actions;
export default profileSlice.reducer;