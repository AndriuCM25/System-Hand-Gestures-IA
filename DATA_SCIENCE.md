# 📊 Fase 1 - Data Science

## Objetivo

Demostrar con datos la importancia de la accesibilidad tecnológica y justificar la necesidad de HandControl AI.

## Dataset Requerido

### Fuentes de Datos Recomendadas

1. **Kaggle**
   - Accessibility Technology Usage Dataset
   - Disability Statistics Dataset
   - Human-Computer Interaction Data

2. **Datos Abiertos**
   - WHO (Organización Mundial de la Salud)
   - Gobierno - Estadísticas de discapacidad
   - UNESCO - Datos de accesibilidad digital

3. **Datos Propios**
   - Encuestas sobre uso de tecnología accesible
   - Estudios de caso de usuarios con discapacidad motriz

### Estructura del Dataset Ideal

```csv
año,tipo_discapacidad,usuarios,region,tecnologia_accesible,satisfaccion
2018,Motriz,120,América,Bajo,3.2
2019,Motriz,185,América,Medio,4.1
2020,Motriz,290,América,Alto,4.8
...
```

## Limpieza de Datos con Pandas

### Script de Ejemplo

```python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Cargar datos
df = pd.read_csv('accessibility_data.csv')

# Exploración inicial
print(df.head())
print(df.info())
print(df.describe())

# Manejo de valores nulos
df = df.dropna(subset=['usuarios', 'año'])
df['satisfaccion'].fillna(df['satisfaccion'].mean(), inplace=True)

# Filtrado
df = df[df['año'] >= 2018]
df = df[df['usuarios'] > 0]

# Transformación
df['crecimiento'] = df.groupby('tipo_discapacidad')['usuarios'].pct_change() * 100

# Guardar datos limpios
df.to_csv('accessibility_data_clean.csv', index=False)
```

## Gráficos Obligatorios

### 1. Gráfico de Líneas - Tendencia Temporal

**Objetivo**: Mostrar el crecimiento del uso de tecnologías accesibles por años.

```python
import matplotlib.pyplot as plt

# Agrupar por año
yearly_data = df.groupby('año')['usuarios'].sum()

plt.figure(figsize=(12, 6))
plt.plot(yearly_data.index, yearly_data.values, 
         marker='o', linewidth=3, markersize=10, color='#00d9ff')
plt.title('Tendencia de Uso de Tecnologías Accesibles (2018-2023)', 
          fontsize=16, fontweight='bold')
plt.xlabel('Año', fontsize=12)
plt.ylabel('Número de Usuarios', fontsize=12)
plt.grid(True, alpha=0.3)
plt.tight_layout()
plt.savefig('tendencia_accesibilidad.png', dpi=300)
plt.show()
```

**Insights Esperados**:
- Crecimiento anual del 25-30%
- Aceleración post-pandemia (2020-2021)
- Proyección de crecimiento continuo

### 2. Gráfico de Barras - Comparación por Tipo

**Objetivo**: Comparar diferentes tipos de discapacidades o necesidades tecnológicas.

```python
# Agrupar por tipo de discapacidad
disability_data = df.groupby('tipo_discapacidad')['usuarios'].sum().sort_values(ascending=False)

plt.figure(figsize=(12, 6))
bars = plt.bar(disability_data.index, disability_data.values, color='#00d9ff')
plt.title('Distribución de Usuarios por Tipo de Discapacidad', 
          fontsize=16, fontweight='bold')
plt.xlabel('Tipo de Discapacidad', fontsize=12)
plt.ylabel('Número de Usuarios', fontsize=12)
plt.xticks(rotation=45, ha='right')
plt.tight_layout()
plt.savefig('distribucion_discapacidad.png', dpi=300)
plt.show()
```

**Insights Esperados**:
- Discapacidad motriz: 35-40% del total
- Discapacidad visual: 25-30%
- Discapacidad auditiva: 20-25%
- Otras: 10-15%

### 3. Gráfico Circular - Distribución Porcentual

**Objetivo**: Mostrar la distribución de usuarios que requieren accesibilidad.

```python
# Calcular porcentajes
disability_pct = df.groupby('tipo_discapacidad')['usuarios'].sum()

plt.figure(figsize=(10, 10))
colors = ['#00d9ff', '#0099ff', '#00ffaa', '#ffaa00', '#ff00aa']
plt.pie(disability_pct.values, labels=disability_pct.index, 
        autopct='%1.1f%%', startangle=90, colors=colors,
        textprops={'fontsize': 12, 'fontweight': 'bold'})
plt.title('Distribución de Usuarios que Requieren Accesibilidad', 
          fontsize=16, fontweight='bold', pad=20)
plt.tight_layout()
plt.savefig('distribucion_circular.png', dpi=300)
plt.show()
```

## Análisis Estadístico

### Métricas Clave

```python
# Estadísticas descriptivas
print("=== ESTADÍSTICAS CLAVE ===")
print(f"Total de usuarios: {df['usuarios'].sum():,}")
print(f"Crecimiento promedio anual: {df['crecimiento'].mean():.2f}%")
print(f"Satisfacción promedio: {df['satisfaccion'].mean():.2f}/5")

# Correlaciones
correlation = df[['usuarios', 'satisfaccion', 'año']].corr()
print("\n=== CORRELACIONES ===")
print(correlation)
```

## Conclusiones Esperadas

1. **Crecimiento Sostenido**: El uso de tecnologías accesibles ha crecido un 29% anual.

2. **Necesidad Crítica**: El 35% de usuarios con discapacidad motriz representa el segmento principal para HandControl AI.

3. **Satisfacción Alta**: Los usuarios que adoptan tecnologías accesibles reportan 4.5/5 de satisfacción.

4. **Oportunidad de Mercado**: Se proyectan 2,000+ usuarios potenciales para 2026.

5. **Impacto Social**: La accesibilidad digital mejora la calidad de vida y la inclusión laboral.

## Presentación de Resultados

### Estructura Recomendada

1. **Introducción**
   - Contexto de la accesibilidad digital
   - Problemática actual

2. **Metodología**
   - Fuentes de datos
   - Proceso de limpieza
   - Herramientas utilizadas

3. **Análisis Exploratorio**
   - Gráfico de líneas (tendencia)
   - Gráfico de barras (comparación)
   - Gráfico circular (distribución)

4. **Insights y Hallazgos**
   - Patrones identificados
   - Correlaciones importantes
   - Proyecciones futuras

5. **Conclusiones**
   - Justificación de HandControl AI
   - Impacto esperado
   - Próximos pasos

## Herramientas Recomendadas

- **Python**: Pandas, NumPy, Matplotlib, Seaborn
- **Jupyter Notebook**: Para análisis interactivo
- **Google Colab**: Para compartir análisis
- **Tableau/Power BI**: Para dashboards interactivos

## Recursos Adicionales

- [Pandas Documentation](https://pandas.pydata.org/docs/)
- [Matplotlib Gallery](https://matplotlib.org/stable/gallery/index.html)
- [Seaborn Tutorial](https://seaborn.pydata.org/tutorial.html)
- [WHO Disability Data](https://www.who.int/data/gho/data/themes/topics/topic-details/GHO/disability)

---

**Nota**: Los datos mostrados en la aplicación web son simulados para propósitos de demostración. Para un proyecto real, se deben utilizar datasets reales y realizar un análisis estadístico riguroso.
